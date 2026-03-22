module Api
  module V1
    module Admin
      class ReleasesController < ApplicationController
        def index
          releases = Release.ordered
          render json: releases, each_serializer: ReleaseSerializer, request: request
        end

        def show
          release = Release.find(params[:id])
          render json: release, serializer: ReleaseSerializer, request: request
        end

        def create
          release = Release.new(release_params)

          if release.save
            render json: release, serializer: ReleaseSerializer, request: request, status: :created
          else
            render json: { errors: release.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          release = Release.find(params[:id])

          if release.update(release_params)
            render json: release, serializer: ReleaseSerializer, request: request
          else
            render json: { errors: release.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          release = Release.find(params[:id])
          release.destroy
          head :no_content
        end

        private

        def release_params
          params.require(:release).permit(
            :title, :release_type, :release_date, :label, :description,
            :spotify_url, :apple_music_url, :bandcamp_url, :other_streaming_url,
            :cover_art, :position, :published
          )
        end
      end
    end
  end
end
