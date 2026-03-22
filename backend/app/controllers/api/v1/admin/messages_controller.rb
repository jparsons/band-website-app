module Api
  module V1
    module Admin
      class MessagesController < ApplicationController
        def index
          messages = ContactMessage.recent
          render json: messages
        end
        
        def update
          message = ContactMessage.find(params[:id])
          
          if message.update(message_params)
            render json: message
          else
            render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def destroy
          message = ContactMessage.find(params[:id])
          message.destroy
          head :no_content
        end
        
        private
        
        def message_params
          params.require(:contact_message).permit(:read)
        end
      end
    end
  end
end
