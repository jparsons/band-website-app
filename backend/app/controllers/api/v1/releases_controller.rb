module Api
  module V1
    class ReleasesController < ApplicationController
      skip_before_action :authenticate_admin

      def index
        releases = Release.published.ordered
        render json: releases, each_serializer: ReleaseSerializer, request: request
      end
    end
  end
end
