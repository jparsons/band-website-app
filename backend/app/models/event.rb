class Event < ApplicationRecord
  validates :title, :venue, :date, presence: true
  
  scope :published, -> { where(published: true) }
  scope :upcoming, -> { where('date >= ?', Time.current).order(date: :asc) }
  scope :past, -> { where('date < ?', Time.current).order(date: :desc) }
  scope :featured, -> { where(featured: true) }
  
  def past?
    date < Time.current
  end
end
