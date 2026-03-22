module Api
  module V1
    module Admin
      class PhotosController < ApplicationController
        def create
          gallery = PhotoGallery.find(params[:gallery_id])
          photo = gallery.photos.new(photo_params)
          
          if photo.save
            render json: photo, status: :created
          else
            render json: { errors: photo.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def update
          photo = Photo.find(params[:id])
          
          if photo.update(photo_params)
            render json: photo
          else
            render json: { errors: photo.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def destroy
          photo = Photo.find(params[:id])
          photo.destroy
          head :no_content
        end
        
        private
        
        def photo_params
          params.require(:photo).permit(:image, :caption, :position)
        end
      end
    end
  end
end
