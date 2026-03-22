module Api
  module V1
    module Admin
      class BandMembersController < ApplicationController
        def index
          band_members = BandMember.ordered
          render json: band_members, each_serializer: BandMemberSerializer, request: request
        end

        def show
          band_member = BandMember.find(params[:id])
          render json: band_member, serializer: BandMemberSerializer, request: request
        end

        def create
          band_member = BandMember.new(band_member_params)

          if band_member.save
            render json: band_member, serializer: BandMemberSerializer, request: request, status: :created
          else
            render json: { errors: band_member.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          band_member = BandMember.find(params[:id])

          if band_member.update(band_member_params)
            render json: band_member, serializer: BandMemberSerializer, request: request
          else
            render json: { errors: band_member.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          band_member = BandMember.find(params[:id])
          band_member.destroy
          head :no_content
        end

        private

        def band_member_params
          params.require(:band_member).permit(:name, :role, :photo, :position, :published)
        end
      end
    end
  end
end
