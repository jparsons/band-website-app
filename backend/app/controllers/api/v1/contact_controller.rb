module Api
  module V1
    class ContactController < ApplicationController
      skip_before_action :authenticate_admin
      
      def create
        message = ContactMessage.new(contact_params)
        
        if message.save
          render json: { message: 'Message sent successfully' }, status: :created
        else
          render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      private
      
      def contact_params
        params.require(:contact_message).permit(:name, :email, :subject, :message)
      end
    end
  end
end
