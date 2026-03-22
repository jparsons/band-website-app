class User < ApplicationRecord
  has_secure_password
  
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  validates :role, inclusion: { in: %w[admin editor] }
  
  before_validation :downcase_email
  
  private
  
  def downcase_email
    self.email = email.downcase if email.present?
  end
end
