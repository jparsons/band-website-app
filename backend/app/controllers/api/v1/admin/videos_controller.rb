module Api
  module V1
    module Admin
      class VideosController < ApplicationController
        def index
          videos = Video.ordered
          render json: videos
        end
        
        def create
          video = Video.new(video_params)
          
          if video.save
            render json: video, status: :created
          else
            render json: { errors: video.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def update
          video = Video.find(params[:id])
          
          if video.update(video_params)
            render json: video
          else
            render json: { errors: video.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def destroy
          video = Video.find(params[:id])
          video.destroy
          head :no_content
        end
        
        private
        
        def video_params
          params.require(:video).permit(:title, :embed_url, :thumbnail, :description, :position, :published)
        end
      end
    end
  end
end
