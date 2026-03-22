module Api
  module V1
    module Admin
      class MerchandiseController < ApplicationController
        def index
          merchandise = Merchandise.ordered
          render json: merchandise
        end
        
        def create
          item = Merchandise.new(merchandise_params)
          
          if item.save
            render json: item, status: :created
          else
            render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def update
          item = Merchandise.find(params[:id])
          
          if item.update(merchandise_params)
            render json: item
          else
            render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def destroy
          item = Merchandise.find(params[:id])
          item.destroy
          head :no_content
        end
        
        private
        
        def merchandise_params
          params.require(:merchandise).permit(
            :name, :description, :price, :image, :category,
            :in_stock, :position, :published, sizes_available: []
          )
        end
      end
    end
  end
end
