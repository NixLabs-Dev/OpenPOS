// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();
      window.open_devtools();
      window.close_devtools();
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![get_environment_variable])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn get_environment_variable (name: &str) -> String {
  std::env::var(name).unwrap_or_else(|_| "".to_string())
}