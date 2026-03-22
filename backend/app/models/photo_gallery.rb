class PhotoGallery < ApplicationRecord
  has_many :photos, dependent: :destroy
  has_one_attached :cover_image

  validates :title, presence: true
  validate :cover_image_attached

  scope :published, -> { where(published: true) }
  scope :ordered, -> { order(position: :asc) }

  after_initialize :set_position, if: :new_record?

  private

  def set_position
    self.position ||= (PhotoGallery.maximum(:position) || 0) + 1
  end

  def cover_image_attached
    errors.add(:cover_image, 'must be attached') unless cover_image.attached?
  end
end
