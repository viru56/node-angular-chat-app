// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  base_url: "http://localhost:3000",
  api_url: 'http://localhost:3000/api',
  google_image_path: 'http://localhost:3000/images/',
  ipInfo_url: 'http://ipinfo.io',
  google_street_view:'https://maps.googleapis.com/maps/api/streetview?',
  google_api_key: 'AIzaSyBkCrRk81jIwnUfMooaAMF70_6XR3Ha0w4'
};
