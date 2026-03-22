class CreateReleases < ActiveRecord::Migration[7.0]
  def change
    create_table :releases do |t|
      t.string :title, null: false
      t.string :release_type, null: false
      t.date :release_date
      t.string :label
      t.text :description
      t.string :spotify_url
      t.string :apple_music_url
      t.string :bandcamp_url
      t.string :other_streaming_url
      t.integer :position, default: 0
      t.boolean :published, default: true
      t.timestamps
    end
  end
end
