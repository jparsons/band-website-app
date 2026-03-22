module Api
  module V1
    module Auth
      class AuthController < ApplicationController
        skip_before_action :authenticate_admin, only: [:login]
        
        def login
          user = User.find_by(email: params[:email]&.downcase)
          
          if user&.authenticate(params[:password])
            token = jwt_encode(user_id: user.id)
            render json: { 
              token: token, 
              user: { id: user.id, email: user.email, role: user.role }
            }, status: :ok
          else
            render json: { error: 'Invalid email or password' }, status: :unauthorized
          end
        end
        
        def logout
          render json: { message: 'Logged out successfully' }, status: :ok
        end
        
        def verify
          render json: { 
            user: { id: current_user.id, email: current_user.email, role: current_user.role }
          }, status: :ok
        end
      end
    end
  end
end
