class AddSectionNamesToBands < ActiveRecord::Migration[7.1]
  def change
    add_column :bands, :nav_events, :string, default: 'Events'
    add_column :bands, :nav_galleries, :string, default: 'Galleries'
    add_column :bands, :nav_videos, :string, default: 'Videos'
    add_column :bands, :nav_merch, :string, default: 'Merch'
    add_column :bands, :nav_contact, :string, default: 'Contact'
    add_column :bands, :nav_about, :string, default: 'About'
  end
end
