class CreateEpkContacts < ActiveRecord::Migration[7.0]
  def change
    create_table :epk_contacts do |t|
      t.string :contact_type, null: false
      t.string :name, null: false
      t.string :email
      t.string :phone
      t.string :company
      t.string :territory
      t.integer :position, default: 0
      t.boolean :published, default: true
      t.timestamps
    end
  end
end
