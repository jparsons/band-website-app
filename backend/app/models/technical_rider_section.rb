class TechnicalRiderSection < ApplicationRecord
  has_one_attached :attachment

  validates :title, presence: true

  scope :published, -> { where(published: true) }
  scope :ordered, -> { order(position: :asc) }

  after_initialize :set_position, if: :new_record?

  private

  def set_position
    self.position ||= (TechnicalRiderSection.maximum(:position) || 0) + 1
  end
end
