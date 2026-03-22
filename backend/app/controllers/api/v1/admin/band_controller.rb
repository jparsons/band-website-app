module Api
  module V1
    module Admin
      class BandController < ApplicationController
        def update
          band = Band.instance

          band.assign_attributes(band_params)

          if band.save
            render json: band, serializer: BandSerializer, request: request
          else
            render json: { errors: band.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def band_params
          permitted = params.require(:band).permit(
            :name, :bio, :logo, :background_image,
            :primary_color, :secondary_color, :heading_font, :body_font,
            :hero_tagline, :about_content, :cta_title, :cta_subtitle,
            :nav_events, :nav_galleries, :nav_videos, :nav_merch, :nav_contact, :nav_about,
            :footer_tagline, :footer_cta,
            :band_members_header,
            :epk_enabled, :epk_headline, :epk_short_bio, :epk_one_sheet
          )

          # Handle social_links separately to avoid issues with nested hash permit
          if params[:band][:social_links].present?
            permitted[:social_links] = params[:band][:social_links].permit(:facebook, :instagram, :twitter, :spotify).to_h
          end

          permitted
        end
      end
    end
  end
end
