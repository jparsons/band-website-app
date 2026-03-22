class CreatePhotoGalleries < ActiveRecord::Migration[7.1]
  def change
    create_table :photo_galleries do |t|
      t.string :title, null: false
      t.text :description
      t.string :cover_image_url
      t.integer :position, default: 0
      t.boolean :published, default: true
      
      t.timestamps
    end
    
    add_index :photo_galleries, :position
  end
end
