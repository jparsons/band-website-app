module Api
  module V1
    class BandMembersController < ApplicationController
      skip_before_action :authenticate_admin

      def index
        band_members = BandMember.published.ordered
        render json: band_members, each_serializer: BandMemberSerializer, request: request
      end
    end
  end
end
