class ContactMessage < ApplicationRecord
  validates :name, :email, :message, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  
  scope :unread, -> { where(read: false) }
  scope :recent, -> { order(created_at: :desc) }
  
  def mark_as_read!
    update(read: true)
  end
end
