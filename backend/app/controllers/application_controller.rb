class ApplicationController < ActionController::API
  include JsonWebToken
  
  before_action :authenticate_admin, if: -> { request.path.include?('/admin') || request.path.include?('/auth/verify') || request.path.include?('/auth/logout') }
  
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  
  private
  
  def authenticate_admin
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    
    begin
      decoded = jwt_decode(token)
      @current_user = User.find(decoded[:user_id])
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
  
  def current_user
    @current_user
  end
  
  def not_found
    render json: { error: 'Resource not found' }, status: :not_found
  end
  
  def unprocessable_entity(exception)
    render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_entity
  end
end
