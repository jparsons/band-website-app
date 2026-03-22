module Api
  module V1
    class MerchandiseController < ApplicationController
      skip_before_action :authenticate_admin
      
      def index
        merchandise = Merchandise.published.ordered
        render json: merchandise
      end
      
      def show
        item = Merchandise.published.find(params[:id])
        render json: item
      end
    end
  end
end
