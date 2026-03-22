module Api
  module V1
    class GalleriesController < ApplicationController
      skip_before_action :authenticate_admin
      
      def index
        galleries = PhotoGallery.published.ordered.includes(:photos)
        render json: galleries, include: ['photos']
      end
      
      def show
        gallery = PhotoGallery.published.find(params[:id])
        render json: gallery, include: ['photos']
      end
    end
  end
end
