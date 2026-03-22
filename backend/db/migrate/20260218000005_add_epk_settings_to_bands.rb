class AddEpkSettingsToBands < ActiveRecord::Migration[7.0]
  def change
    add_column :bands, :epk_enabled, :boolean, default: true
    add_column :bands, :epk_headline, :string
    add_column :bands, :epk_short_bio, :text
    add_column :bands, :epk_one_sheet, :text
  end
end
