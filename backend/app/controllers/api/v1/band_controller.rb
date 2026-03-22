module Api
  module V1
    class BandController < ApplicationController
      skip_before_action :authenticate_admin
      
      def show
        band = Band.instance
        render json: band
      end
    end
  end
end
