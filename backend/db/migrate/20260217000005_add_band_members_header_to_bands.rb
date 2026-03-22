class AddBandMembersHeaderToBands < ActiveRecord::Migration[7.1]
  def change
    add_column :bands, :band_members_header, :string, default: 'Band Members'
  end
end
