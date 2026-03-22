module Api
  module V1
    class VideosController < ApplicationController
      skip_before_action :authenticate_admin
      
      def index
        videos = Video.published.ordered
        render json: videos
      end
    end
  end
end
