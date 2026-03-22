module Api
  module V1
    module Admin
      class TechnicalRiderSectionsController < ApplicationController
        def index
          sections = TechnicalRiderSection.ordered
          render json: sections, each_serializer: TechnicalRiderSectionSerializer, request: request
        end

        def show
          section = TechnicalRiderSection.find(params[:id])
          render json: section, serializer: TechnicalRiderSectionSerializer, request: request
        end

        def create
          section = TechnicalRiderSection.new(technical_rider_section_params)

          if section.save
            render json: section, serializer: TechnicalRiderSectionSerializer, request: request, status: :created
          else
            render json: { errors: section.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          section = TechnicalRiderSection.find(params[:id])

          if section.update(technical_rider_section_params)
            render json: section, serializer: TechnicalRiderSectionSerializer, request: request
          else
            render json: { errors: section.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          section = TechnicalRiderSection.find(params[:id])
          section.destroy
          head :no_content
        end

        private

        def technical_rider_section_params
          params.require(:technical_rider_section).permit(
            :title, :content, :attachment, :position, :published
          )
        end
      end
    end
  end
end
