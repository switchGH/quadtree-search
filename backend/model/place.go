package model

type Place struct {
	ID              int64  `db:"id" json:"increment_id"`
	InstitutionID   int64  `db:"institution_id" json:"institution_id"`
	InstitutionName string `db:"institution_name" json:"institution_name"`
	//InstitutionNameKana       string `db:"institution_name_kana" json:"institution_name_kana"`
	// InstitutionClassification string `db:"institution_classification" json:"institution_classification"`
	// PostCode                  string `db:"post_code" json:"post_code"`
	// Prefectures               string `db:"prefectures" json:"prefectures"`
	// Municipality              string `db:"municipality" json:"municipality"`
	// StreetBranch              string `db:"street_branch" json:"street_branch"`
	// BuildingName              string `db:"building_name" json:"building_name"`
	// CreatedAt                 int64   `db:"created_at" json:"created_at"`
	// UpdatedAt                 int64   `db:"updated_at" json:"updated_at"`
	// LocationID   int64  `db:"location_id" json:"location_id"`
	// LocationName string `db:"location_name" json:"location_name"`
	// InstallationDate          int64   `db:"installation_date" json:"installation_date"`
	// AedModel  string  `db:"aed_model" json:"aed_model"`
	Latitude  float64 `db:"latitude" json:"latitude"`
	Longitude float64 `db:"longitude" json:"longitude"`
	Path      string  `db:"path" json:"path"`
}
