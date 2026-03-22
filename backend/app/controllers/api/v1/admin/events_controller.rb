module Api
  module V1
    module Admin
      class EventsController < ApplicationController
        def index
          events = Event.order(date: :desc)
          render json: events
        end
        
        def create
          event = Event.new(event_params)
          
          if event.save
            render json: event, status: :created
          else
            render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def update
          event = Event.find(params[:id])
          
          if event.update(event_params)
            render json: event
          else
            render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def destroy
          event = Event.find(params[:id])
          event.destroy
          head :no_content
        end
        
        private
        
        def event_params
          params.require(:event).permit(
            :title, :venue, :address, :city, :state, :date, 
            :doors_open, :show_starts, :ticket_url, :description, 
            :featured, :published
          )
        end
      end
    end
  end
end
