class CreateBandMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :band_members do |t|
      t.string :name, null: false
      t.string :role
      t.integer :position, default: 0
      t.boolean :published, default: true

      t.timestamps
    end

    add_index :band_members, :position
  end
end
