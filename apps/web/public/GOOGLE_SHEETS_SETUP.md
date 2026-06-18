# Google Sheets API Setup Guide for ArtisanCongo

Follow these steps to enable automatic lead exports to Google Sheets.

## Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project drop-down at the top and select **New Project**.
3. Name it `ArtisanCongo-Leads` and click **Create**.

## Step 2: Enable Google Sheets API
1. In the Cloud Console, go to **APIs & Services > Library**.
2. Search for **Google Sheets API**.
3. Click on it and click **Enable**.

## Step 3: Create a Service Account
1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials** at the top and select **Service account**.
3. Name it `sheets-exporter` and click **Create and Continue**.
4. Grant it the role of **Editor** (optional but recommended for writing) and click **Done**.

## Step 4: Download JSON Credentials
1. In the Credentials list, click on the newly created service account email.
2. Go to the **Keys** tab.
3. Click **Add Key > Create new key**.
4. Choose **JSON** and click **Create**. The file will download to your computer.
5. Open the file, copy its entire contents.

## Step 5: Create the Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it `ArtisanCongo Leads`.
3. Rename the first tab at the bottom to `Leads`.
4. Add the following headers in row 1 (A to J):
   `Lead ID` | `Client Name` | `Phone` | `Email` | `Category` | `Artisan` | `Status` | `Date` | `Quote Amount` | `Commission Amount`

## Step 6: Share Sheet with Service Account
1. Open your downloaded JSON key file and find the `client_email` address.
2. In your Google Sheet, click the **Share** button in the top right.
3. Paste the service account email, ensure it is set to **Editor**, and click **Send**.

## Step 7: Configure Environment Variables
1. Look at the URL of your Google Sheet. It looks like this:
   `https://docs.google.com/spreadsheets/d/1XIr-RExJWYtuxg5vE60kf4-t5k-PnK31M8YsA9BI2Mc/edit`
2. Copy the long ID in the middle (`1XIr-RExJWYtuxg5vE60kf4-t5k-PnK31M8YsA9BI2Mc`).
3. Open `apps/api/.env` in your project.
4. Set the variables: