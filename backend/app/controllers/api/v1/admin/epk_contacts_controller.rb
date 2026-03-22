module Api
  module V1
    module Admin
      class EpkContactsController < ApplicationController
        def index
          epk_contacts = EpkContact.ordered
          render json: epk_contacts, each_serializer: EpkContactSerializer
        end

        def show
          epk_contact = EpkContact.find(params[:id])
          render json: epk_contact, serializer: EpkContactSerializer
        end

        def create
          epk_contact = EpkContact.new(epk_contact_params)

          if epk_contact.save
            render json: epk_contact, serializer: EpkContactSerializer, status: :created
          else
            render json: { errors: epk_contact.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          epk_contact = EpkContact.find(params[:id])

          if epk_contact.update(epk_contact_params)
            render json: epk_contact, serializer: EpkContactSerializer
          else
            render json: { errors: epk_contact.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          epk_contact = EpkContact.find(params[:id])
          epk_contact.destroy
          head :no_content
        end

        private

        def epk_contact_params
          params.require(:epk_contact).permit(
            :contact_type, :name, :email, :phone, :company, :territory,
            :position, :published
          )
        end
      end
    end
  end
end
