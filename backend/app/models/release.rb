class Release < ApplicationRecord
  has_one_attached :cover_art

  validates :title, presence: true
  validates :release_type, presence: true, inclusion: { in: %w[album ep single] }

  scope :published, -> { where(published: true) }
  scope :ordered, -> { order(position: :asc) }
  scope :by_release_date, -> { order(release_date: :desc) }

  after_initialize :set_position, if: :new_record?

  private

  def set_position
    self.position ||= (Release.maximum(:position) || 0) + 1
  end
end
