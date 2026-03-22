class Photo < ApplicationRecord
  belongs_to :photo_gallery
  has_one_attached :image

  validate :image_attached

  scope :ordered, -> { order(position: :asc) }

  after_initialize :set_position, if: :new_record?

  private

  def set_position
    self.position ||= (photo_gallery&.photos&.maximum(:position) || 0) + 1
  end

  def image_attached
    errors.add(:image, 'must be attached') unless image.attached?
  end
end
