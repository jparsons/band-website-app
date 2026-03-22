class RemoveImageUrlColumns < ActiveRecord::Migration[7.1]
  def change
    remove_column :bands, :logo_url, :string
    remove_column :bands, :background_image_url, :string
    remove_column :photos, :image_url, :string
    remove_column :photo_galleries, :cover_image_url, :string
    remove_column :merchandises, :image_url, :string
    remove_column :videos, :thumbnail_url, :string
  end
end
