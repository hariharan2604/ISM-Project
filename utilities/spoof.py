from scapy.all import *
import json

def forge_and_send_udp_packet(src_ip, src_port, dst_ip, dst_port, payload):
    # Create an IP layer with specified source and destination IP addresses
    ip_layer = IP(src=src_ip, dst=dst_ip)
    
    # Create a UDP layer with specified source and destination ports
    udp_layer = UDP(sport=src_port, dport=dst_port)
    
    # Construct the packet by combining the IP and UDP layers with the payload
    packet = ip_layer / udp_layer / payload
    
    # Send the packet
    send(packet)

source_ip = "127.0.0.1"
source_port = 10000
destination_ip = "127.0.0.1"
destination_port = 6000
payload_data = {
    "regno": "21BIT0381",
    "sign":"NhuMHXHykxPAb/6Gzod5+HDA3PQ9is+Whx3qNHOTq1iBHC73ScRGhmVRJ450cExwjZ0/VuOTw+9QQOx12qopJUImP/Q+WormHZYUZT4dWB25cZdQGKuNtypE2sWrO+OBBt0Dw0SYYSgz0GKOMn37qfhTuaZNVXkmkgAOetRjYAyv8TJGdxy5mH+AMTSIdBBS5i1Nn8LQI8TTgDU87HywghEeoclonPGAUzkwQXEcU+ic8hhqBLuS4JsJYXiQizTQ+Xq8E7rrqFG6qyb6NzxUC2UYwKVcLLq2C2/pDaUWWepQ9eShcYa20YS2zyxc4H3PgB2up3xu7M2DXWUdi3093Q=="
}

# Convert payload_data to JSON format
payload_json = json.dumps(payload_data)

forge_and_send_udp_packet(source_ip, source_port, destination_ip, destination_port, payload_json)
