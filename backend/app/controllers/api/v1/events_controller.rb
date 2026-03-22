module Api
  module V1
    class EventsController < ApplicationController
      skip_before_action :authenticate_admin
      
      def index
        events = Event.published.upcoming
        render json: events
      end
      
      def show
        event = Event.published.find(params[:id])
        render json: event
      end
    end
  end
end
