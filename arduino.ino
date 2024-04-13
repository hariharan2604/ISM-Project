#include "AES.h"
#include "base64_utils.h"
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <Adafruit_BMP085.h>
#include "DHT.h"
#define DHTPIN 0 // Define the pin to which the sensor is connected (D4 on NodeMCU)
#define DHTTYPE DHT11 // Define the type of sensor (DHT11 in this case)
Adafruit_BMP085 bmp;
DHT dht(DHTPIN, DHTTYPE);
#ifndef STASSID
#define STASSID "realme7"
#define STAPSK "12345678"
#endif

const char* ssid = STASSID;
const char* password = STAPSK;
const char* host = "192.168.86.199";
const int port = 3001; // UDP port
// Constants for AES encryption
const byte AES_KEY_SIZE = 16; // AES key size in bytes (128 bits)
const byte AES_IV_SIZE = 16;  // AES initialization vector size in bytes
const int MAX_MESSAGE_LENGTH = 200; // Maximum length of the message to encrypt
const int MAX_CIPHER_LENGTH = 256; // Maximum length of the encrypted cipher
struct SensorData {
  float temperature;
  float humidity;
  float pressure;
};
WiFiUDP udpClient;
// The AES library object.
AES aes;

// Our AES key. Note that it's the same as used on the Node-Js side but as hex bytes.
byte key[] = { 0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C };

// Our constant initialization vector
const byte IV_CONSTANT[AES_IV_SIZE] = { 0 }; // Initialize to all zeros

// Our message to encrypt. Static for this example.
String msg = "{\"data\":{\"value\":300}, \"SEQN\":700 , \"msg\":\"IT WORKS!!\" }";

uint8_t getrnd() {
    uint8_t really_random = *(volatile uint8_t *)0x3FF20E44;
    return really_random;
}

// Generate a random initialization vector
void gen_iv(byte *iv) {
    for (int i = 0; i < AES_IV_SIZE; i++) {
        iv[i] = (byte)getrnd();
    }
}

void setup() {
  Serial.begin(115200);
  delay(100);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  udpClient.begin(port);
  dht.begin();
  if (!bmp.begin()) {
	Serial.println("Could not find a valid BMP085 sensor, check wiring!");
	while (1) {}
  }
}

void loop() {
    sendData();
    delay(10000); // Wait for 10 seconds before running again
}

void sendData() {
    char b64data[MAX_MESSAGE_LENGTH];
    byte cipher[MAX_CIPHER_LENGTH];
    byte iv[AES_IV_SIZE];

    Serial.println("Let's encrypt:");

    aes.set_key(key, sizeof(key)); // Get the globally defined key
    memcpy(iv, IV_CONSTANT, AES_IV_SIZE); // Copy the constant IV

    // Print the IV
    b64_encode(b64data, (char *)iv, AES_IV_SIZE);
    Serial.println(" IV b64: " + String(b64data));

    SensorData sensorData;
  sensorData.temperature = bmp.readTemperature();
  sensorData.humidity = dht.readHumidity();
  sensorData.pressure = bmp.readPressure();

  // Convert sensor data to JSON string
  String msg = "{\"temperature\":" + String(sensorData.temperature) + ","
                            "\"humidity\":" + String(sensorData.humidity) + ","
                            "\"pressure\":" + String(sensorData.pressure) + "}";
    Serial.println(" Message: " + msg);

    int b64len = b64_encode(b64data, (char *)msg.c_str(), msg.length());
    Serial.println(" Message in B64: " + String(b64data));
    Serial.println(" The length is:  " + String(b64len));

    // Encrypt! With AES128, our key and IV, CBC and pkcs7 padding
    aes.do_aes_encrypt((byte *)b64data, b64len, cipher, key, 128, iv);

    Serial.println("Encryption done!");

    Serial.println("Cipher size: " + String(aes.get_size()));

    b64_encode(b64data, (char *)cipher, aes.get_size());
    Serial.println("Encrypted data in base64: " + String(b64data));
    udpClient.beginPacket(host, port);
    udpClient.print(b64data);
    udpClient.endPacket();
    Serial.println("Done...");
}
