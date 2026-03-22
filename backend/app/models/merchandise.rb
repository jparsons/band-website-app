class Merchandise < ApplicationRecord
  has_one_attached :image

  validates :name, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validate :image_attached

  scope :published, -> { where(published: true) }
  scope :in_stock, -> { where(in_stock: true) }
  scope :ordered, -> { order(position: :asc) }
  scope :by_category, ->(category) { where(category: category) }

  after_initialize :set_position, if: :new_record?

  private

  def set_position
    self.position ||= (Merchandise.maximum(:position) || 0) + 1
  end

  def image_attached
    errors.add(:image, 'must be attached') unless image.attached?
  end
end
