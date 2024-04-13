import PluginBase from "libs/PluginBase";
import { PLUGIN_ID } from "./const";
import Plugin from "./plugin";

export default class DemoPlugin extends PluginBase {
  constructor(options = {}) {
    options.pluginId = PLUGIN_ID;
    super(Plugin, options);
  }
}
