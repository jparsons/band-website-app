class CreatePhotos < ActiveRecord::Migration[7.1]
  def change
    create_table :photos do |t|
      t.references :photo_gallery, null: false, foreign_key: true
      t.string :image_url, null: false
      t.string :caption
      t.integer :position, default: 0
      
      t.timestamps
    end
    
    add_index :photos, :position
  end
end
