package
{
	import flash.display.*;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.*;
	import flash.utils.getTimer;
	
	import flash.system.fscommand;
	import flash.geom.Rectangle;
	
	import org.flixel.system.FlxPreloader;
	
	
	[SWF(width = "800", height = "400", backgroundColor = "#FFFFFF")]
	
	public class GreekFutilityPreloader extends FlxPreloader {
		
		[Embed(source="assets/fonts/Commodore Pixelized v1.2.ttf", fontName="COMMODORE", fontWeight="Regular", embedAsCFF="false")]
		private var COMMODORE_FONT:Class;

		private var _loadingText:TextField;
		private var _loadingTextFormat:TextFormat;
		
		private var _bg:Bitmap;
		private var _loadingBar:Bitmap;
		private var _loadingBarBGBlack:Bitmap;
		private var _loadingBarBGWhite:Bitmap;
		
		private var _playButton:TextField;
		private var _playButtonFormat:TextFormat;
		
		private var _timer:uint = 0;
		
		public function GreekFutilityPreloader() {			
			className = "TheGreekFutilityGames";
			super();
			
			stage.showDefaultContextMenu = false;
			stage.displayState = StageDisplayState.FULL_SCREEN;
			stage.scaleMode = StageScaleMode.SHOW_ALL;
			stage.fullScreenSourceRect = new Rectangle(0,0,800,400);
			
			stage.align = StageAlign.TOP;
			
			fscommand("trapallkeys","true");
		}
		
		override protected function create():void {
			
			Font.registerFont(COMMODORE_FONT);
			
			// Set minimum running time of the preload
			_min = 8000000;
			
			// Create a buffer Sprite
			_buffer = new Sprite();
			addChild(_buffer);	
						
			
			// Textfield to display boarding messages
			_loadingTextFormat = new TextFormat("COMMODORE",50,0xFFFFFF,null,null,false,null,null,"center",null,null,null,null);
			_loadingText = new TextField();
			_loadingText.width = stage.stageWidth;
			_loadingText.x = stage.x;
			_loadingText.y = stage.stageHeight/2 - 100;
			_loadingText.embedFonts = true;
			_loadingText.selectable = false;
			_loadingText.defaultTextFormat = _loadingTextFormat;
			_loadingText.text = "LOADING";
			
			_playButton = new TextField();
			_playButtonFormat = new TextFormat("COMMODORE",30,0xFFFFFF,null,null,false,null,null,"center",null,null,null,null);
			_playButton.width = stage.stageWidth;
			_playButton.x = stage.x;
			_playButton.y = stage.stageHeight/2 - 10;
			_playButton.embedFonts = true;
			_playButton.selectable = false;
			_playButton.defaultTextFormat = _playButtonFormat;
			_playButton.text = "CLICK TO PLAY!";
			
			_bg = new Bitmap(new BitmapData(800,400,false,0x000000));
			_bg.x = 0; _bg.y = 0;
			
			_loadingBarBGWhite = new Bitmap(new BitmapData(300,20,false,0xFFFFFF));
			_loadingBarBGBlack = new Bitmap(new BitmapData(298,18,false,0x000000));
			_loadingBar = new Bitmap(new BitmapData(1,16,false,0xFFFFFF));
			
			_loadingBarBGWhite.x = stage.stageWidth/2 - _loadingBarBGWhite.width/2;
			_loadingBarBGWhite.y = stage.stageHeight/2 - 40;
			_loadingBarBGBlack.x = stage.stageWidth/2 - _loadingBarBGBlack.width/2;
			_loadingBarBGBlack.y = _loadingBarBGWhite.y + 1;
			_loadingBar.x = _loadingBarBGBlack.x + 1;
			_loadingBar.y = _loadingBarBGBlack.y + 1;
			
			_buffer.addChild(_bg);
			_buffer.addChild(_loadingBarBGWhite);
			_buffer.addChild(_loadingBarBGBlack);
			_buffer.addChild(_loadingBar);

			_buffer.addChild(_loadingText);	
			
			
		}
		
		override protected function update(Percent:Number):void {
			
			var ActualPercent:Number = root.loaderInfo.bytesLoaded / root.loaderInfo.bytesTotal;
			_loadingBar.scaleX = ActualPercent * 296;
			
			if (root.loaderInfo.bytesLoaded < root.loaderInfo.bytesTotal && getTimer() < _min) {
				_timer++;
			}
			else {
				_loadingText.text = "LOADED";
				_buffer.addChild(_playButton);
				stage.addEventListener(MouseEvent.MOUSE_DOWN,mouseDown);
			}
			
		}
		
		private function mouseDown(e:MouseEvent):void {
			_min = 3000;
			stage.focus = null;
		}
		
	}
}