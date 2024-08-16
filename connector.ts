import { Connector, Media } from "@chili-publish/studio-connectors";

export default class MyConnector implements Media.MediaConnector {

  private runtime: Connector.ConnectorRuntimeContext;

  constructor(runtime: Connector.ConnectorRuntimeContext) {
    this.runtime = runtime;
  }

  async query(
    options: Connector.QueryOptions,
    context: Connector.Dictionary
  ): Promise<Media.MediaPage> {

    this.runtime.logError("Query Called")

    return {
      pageSize: options.pageSize, // Note: pageSize is not currently used by the UI
      data: [{ id: "pr22", name: "pr22", relativePath: "/", type: 0, metaData: {} }, { id: "pr4", name: "pr4", relativePath: "/", type: 0, metaData: {} }, { id: "pr50", name: "pr50", relativePath: "/", type: 0, metaData: {} }],
      links: {
        nextPage: "" // Pagination is ignored in this example
      }
    }

  }

  async detail(
    id: string,
    context: Connector.Dictionary
  ): Promise<Media.MediaDetail> {

    this.runtime.logError("Detail id = " + id);

    return { id: id, name: id, relativePath: "/", type: 0, metaData: {} }
  }

  async download(
    id: string,
    previewType: Media.DownloadType,
    intent: Media.DownloadIntent,
    context: Connector.Dictionary
  ): Promise<Connector.ArrayBufferPointer> {

    this.runtime.logError("Download id = " + id)

    // Check to see if we are a thumbnail in the UI or being used in another situation.
    switch (previewType) {
      case "thumbnail": {
        const picture = await this.runtime.fetch(`https://picsum.photos/id/${id.substr(2)}/200`, { method: "GET" });
        return picture.arrayBuffer;
      }
      default: {
        const picture = await this.runtime.fetch(`https://picsum.photos/id/${id.substr(2)}/1000`, { method: "GET" });
        return picture.arrayBuffer;
      }
    }
  }

  getConfigurationOptions(): Connector.ConnectorConfigValue[] | null {
    return [];
  }
  getCapabilities(): Media.MediaConnectorCapabilities {
    return {
      query: true,
      detail: true,
      filtering: true,
      metadata: false,
    };
  }
}
