module Api
  module V1
    module Admin
      class GalleriesController < ApplicationController
        def index
          galleries = PhotoGallery.ordered.includes(:photos)
          render json: galleries, include: ['photos']
        end
        
        def create
          gallery = PhotoGallery.new(gallery_params)
          
          if gallery.save
            render json: gallery, status: :created
          else
            render json: { errors: gallery.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def update
          gallery = PhotoGallery.find(params[:id])
          
          if gallery.update(gallery_params)
            render json: gallery
          else
            render json: { errors: gallery.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def destroy
          gallery = PhotoGallery.find(params[:id])
          gallery.destroy
          head :no_content
        end
        
        private
        
        def gallery_params
          params.require(:photo_gallery).permit(:title, :description, :cover_image, :position, :published)
        end
      end
    end
  end
end
