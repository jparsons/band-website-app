class Band < ApplicationRecord
  has_one_attached :logo
  has_one_attached :background_image
  
  validates :name, presence: true
  validates :primary_color, :secondary_color, format: { with: /\A#[0-9A-F]{6}\z/i }, allow_blank: true
  
  def self.instance
    first_or_create!(name: 'My Band')
  end
end
