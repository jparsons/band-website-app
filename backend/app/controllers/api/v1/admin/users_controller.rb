module Api
  module V1
    module Admin
      class UsersController < ApplicationController
        def index
          users = User.order(created_at: :desc)
          render json: users, each_serializer: UserSerializer
        end

        def show
          user = User.find(params[:id])
          render json: user, serializer: UserSerializer
        end

        def create
          user = User.new(user_params)

          if user.save
            render json: user, serializer: UserSerializer, status: :created
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          user = User.find(params[:id])

          # Don't allow users to demote themselves
          if user.id == current_user.id && params[:user][:role] && params[:user][:role] != user.role
            return render json: { errors: ["You cannot change your own role"] }, status: :unprocessable_entity
          end

          if user.update(user_update_params)
            render json: user, serializer: UserSerializer
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          user = User.find(params[:id])

          # Don't allow users to delete themselves
          if user.id == current_user.id
            return render json: { errors: ["You cannot delete your own account"] }, status: :unprocessable_entity
          end

          user.destroy
          head :no_content
        end

        private

        def user_params
          params.require(:user).permit(:email, :password, :password_confirmation, :role)
        end

        def user_update_params
          # Only include password if it's being changed
          if params[:user][:password].present?
            params.require(:user).permit(:email, :password, :password_confirmation, :role)
          else
            params.require(:user).permit(:email, :role)
          end
        end
      end
    end
  end
end
