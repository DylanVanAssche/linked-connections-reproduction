# Linked Connections Reproduction

A reproducible environment for Linked Connections.

## GTFS and GTFS-RT data
This file server creates 2 resources for the Linked Connections Server:

1. `/static`: For the GTFS data
2. `/realtime`: For the GTFS-RT data

If you want to serve the data through the Linked Connections Server, you can add those 2 resources to the configuration file of the Linked Connections Server.
The Linked Connections Server will think that the data is coming from a real public transport resource.

## Directly serving the events
The file server can also serve the Linked Connections real time resource events directly:

1. `/events`: For HTTP polling clients, the JSON-LD data is polled from this resource.
2. `/events/sse`: For SSE clients, they connect to this resource and get the JSON-LD data automatically with pushing.

## Build instructions

Make sure that you have NodeJS 11.X or later installed, together with the latest Yarn package manager.

In the root directory of this repository run the following commands:

1. `yarn install`
2. `yarn start`
