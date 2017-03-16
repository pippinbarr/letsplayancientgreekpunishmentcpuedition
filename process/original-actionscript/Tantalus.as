package
{
	
	import flash.events.KeyboardEvent;
	import flash.sampler.startSampling;
	import flash.text.*;
	import flash.ui.Keyboard;
	
	import flashx.textLayout.formats.Float;
	
	import org.flixel.*;
	
	public class Tantalus extends FlxState {
		
		[Embed(source="assets/sprites/tantalus/tantalus.png")]
		private const TANTALUS_ANIMATION:Class;
		
		[Embed(source="assets/fonts/Commodore Pixelized v1.2.ttf", fontName="COMMODORE", fontWeight="Regular", embedAsCFF="false")]
		public static const COMMODORE_FONT:Class;
		
		private const IDLE:uint = 0;
		private const REACHING:uint = 1;
		private const REACHLOOP:uint = 2;
		private const UNREACHING:uint = 3;
		private const STOOPING:uint = 4;
		private const STOOPLOOP:uint = 5;
		private const UNSTOOPING:uint = 6;
		
		private const MAX_KEY_DELAY:Number = 0.3;
		
		private const IDLE_FRAMES:Array = new Array(
			0,0
			);
		private const REACH_FRAMES:Array = new Array(
			1,2,3,4
			);
		private const REACH_LOOP:Array = new Array(
			5,6
			);
		private const UNREACH_FRAMES:Array = new Array(
			4,3,2,1
			);
		private const STOOP_FRAMES:Array = new Array(
			7,8,9,10,11
			);
		private const STOOP_LOOP:Array = new Array(
			12,13
			);
		private const UNSTOOP_FRAMES:Array = new Array(
			11,10,9,8,7
			);
				
		private const FRUIT_PREFIX:String = "FRUIT: 0";
		private const WATER_PREFIX:String = "WATER: 0";
		
		private var _tantalus:FlxSprite;
		
		private var _fruitText:TextField;
		private var _waterText:TextField;
		private var _textFormat:TextFormat = new TextFormat("COMMODORE",32,0xFFFFFF,null,null,null,null,null,"left");
		private var _textFormatBlack:TextFormat = new TextFormat("COMMODORE",32,0x000000,null,null,null,null,null,"left");
		
		private var _fruitInstructionsText:TextField;
		private var _waterInstructionsText:TextField;
		private var _instructionsTextFormat:TextFormat = new TextFormat("COMMODORE",24,0x000000,null,null,null,null,null,"center");
		private var _instructionsTextFormatWhite:TextFormat = new TextFormat("COMMODORE",24,0xFFFFFF,null,null,null,null,null,"center");
		private const FRUIT_INSTRUCTIONS_TEXT:String = "RAPIDLY PRESS 'G' TO TAKE THE FRUIT!";
		private const WATER_INSTRUCTIONS_TEXT:String = "RAPIDLY PRESS 'H' TO DRINK THE WATER!";

		private var _lastKey:uint = 0;
		private var _frameCount:uint = 0;
		private var _gCount:uint = 0;
		private var _hCount:uint = 0;
		
		private var _currentFrame:int = 0;
		private var _timeSincePress:Number = 0;
		private var _pressed:Boolean = false;
		
		private var _state:uint = IDLE;
				
		private var _timer:FlxTimer;
		
		
		public function Tantalus() {
		}
		
		public override function create():void {
			
			FlxG.bgColor = 0xFFAAFFAA;
			
			_timer = new FlxTimer();
			
			_tantalus = new FlxSprite();
			_tantalus.loadGraphic(TANTALUS_ANIMATION,true,false,200,100);
			_tantalus.addAnimation("idle",IDLE_FRAMES,5,false);
			_tantalus.addAnimation("reach",REACH_FRAMES,5,false);
			_tantalus.addAnimation("reachLoop",REACH_LOOP,5,true);
			_tantalus.addAnimation("unreach",UNREACH_FRAMES,5,false);
			_tantalus.addAnimation("stoop",STOOP_FRAMES,5,false);
			_tantalus.addAnimation("stoopLoop",STOOP_LOOP,5,true);
			_tantalus.addAnimation("unstoop",UNSTOOP_FRAMES,5,false);
			_tantalus.x = 0; _tantalus.y = 0;
			_tantalus.play("idle");
			
			_fruitText = Helpers.makeTextField(40,5,FlxG.width,FlxG.height,FRUIT_PREFIX,_textFormatBlack);
			_waterText = Helpers.makeTextField(75,85,FlxG.width,FlxG.height,WATER_PREFIX,_textFormat);
			_fruitText.rotation = 32;
			_fruitInstructionsText = Helpers.makeTextField(110,20,90,FlxG.height,FRUIT_INSTRUCTIONS_TEXT,_instructionsTextFormat);
			_waterInstructionsText = Helpers.makeTextField(5,65,50,FlxG.height,WATER_INSTRUCTIONS_TEXT,_instructionsTextFormatWhite);

			this.add(_tantalus);
			
			FlxG.stage.addChild(_fruitText);
			FlxG.stage.addChild(_waterText);
			FlxG.stage.addChild(_fruitInstructionsText);
			FlxG.stage.addChild(_waterInstructionsText);

			FlxG.stage.addEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);
						
			super.create();
			
		}
		
		
		public override function update():void {
			
			_timeSincePress += FlxG.elapsed;
						
			if (_state == REACHING && _tantalus.frame == 3) {
				Assets.swoopUp.volume = 1;
				Assets.swoopUp.play();
			}
			if (_state == UNREACHING && _tantalus.frame == 4) {
				Assets.swoopDown.volume = 1;
				Assets.swoopDown.play();
			}
			if (_state == STOOPING && _tantalus.frame == 9) {
				Assets.swoopDown.volume = 1;
				Assets.swoopDown.play();
			}
			if (_state == UNSTOOPING && _tantalus.frame == 9) {
				Assets.swoopUp.volume = 1;
				Assets.swoopUp.play();
			}
			
			if (_state == REACHING && _tantalus.finished) {
				_state = REACHLOOP;
				_tantalus.play("reachLoop");
				if (FlxG.stage.contains(_fruitInstructionsText)) {
					FlxG.stage.removeChild(_fruitInstructionsText);
					FlxG.stage.focus = null;
				}

			}
			else if (_state == UNREACHING && _tantalus.finished) {
				_state = IDLE;
				_tantalus.play("idle");
			}
			else if (_state == STOOPING && _tantalus.finished) {
				_state = STOOPLOOP;
				_tantalus.play("stoopLoop");
				if (FlxG.stage.contains(_waterInstructionsText)) {
					FlxG.stage.removeChild(_waterInstructionsText);
					FlxG.stage.focus = null;
				}
			}
			else if (_state == UNSTOOPING && _tantalus.finished) {
				_state = IDLE;
				_tantalus.play("idle");
			}
			
			if (_pressed && _lastKey == Keyboard.G) {
				if (_state == IDLE) {
					_state = REACHING;
					_tantalus.play("reach");
				}
				else if (_state == UNREACHING) {
					_state = REACHING;
					_tantalus.playFromFrame("reaching",false,unreachToReach(_tantalus.frame));
				}
				else if (_state == STOOPING) {
					_state = UNSTOOPING;
					_tantalus.playFromFrame("unstoop",false,stoopToUnstoop(_tantalus.frame));
				}
				else if (_state == STOOPLOOP) {
					_state = UNSTOOPING;
					_tantalus.play("unstoop");
				}
			}
			else if (_pressed && _lastKey == Keyboard.H) {
				if (_state == IDLE) {
					_state = STOOPING;
					_tantalus.play("stoop");
				}
				else if (_state == UNSTOOPING) {
					_state = STOOPING;
					_tantalus.playFromFrame("stoop",false,unstoopToStoop(_tantalus.frame));
				}
				else if (_state == REACHING) {
					_state = UNREACHING;
					_tantalus.playFromFrame("unreach",false,reachToUnreach(_tantalus.frame));
				}
				else if (_state == REACHLOOP) {
					_state = UNREACHING;
					_tantalus.play("unreach");
				}
			}
			else {
				if (_state == REACHING) {
					_state = UNREACHING;
					_tantalus.playFromFrame("unreach",false,reachToUnreach(_tantalus.frame));
				}
				else if (_state == REACHLOOP) {
					_state = UNREACHING;
					_tantalus.play("unreach");
				}
				else if (_state == STOOPING) {
					_state = UNSTOOPING;
					_tantalus.playFromFrame("unstoop",false,stoopToUnstoop(_tantalus.frame));
				}
				else if (_state == STOOPLOOP) {
					_state = UNSTOOPING;
					_tantalus.play("unstoop");
				}
			}
			
			if (_timeSincePress > MAX_KEY_DELAY) _pressed = false;
			
			_frameCount = (_frameCount + 1) % FlxG.framerate;
			
			if (_frameCount == 0) {
				_gCount = 0;
				_hCount = 0;
			}
			
			_currentFrame = _tantalus.frame;
			
			super.update();
			
		}
		
		private function reachToUnreach(f:uint):uint {
			
			var result:int = (REACH_FRAMES.length - 1 - (f - 1));
			trace(f + " --> " + result);
			if (result >= UNREACH_FRAMES.length) result = UNREACH_FRAMES.length - 1;
			if (result < 0) result = 0;
			return result;
			
		}
		
		private function unreachToReach(f:uint):uint {
			
			var result:int = (f - 1);
			trace(f + " --> " + result);
			if (result < 0) result = 0;
			if (result >= REACH_FRAMES.length) result = REACH_FRAMES.length - 1;
			return result;
			
		}
		
		private function stoopToUnstoop(f:uint):uint {
			
			var result:int = (STOOP_FRAMES.length - 1 - (f - 7));
			trace(f + " --> " + result);
			if (result >= UNSTOOP_FRAMES.length) result = UNSTOOP_FRAMES.length - 1;
			if (result < 0) result = 0;
			return result;
			
		}
		
		private function unstoopToStoop(f:uint):uint {
			
			var result:int = (f - 7);
			trace(f + " --> " + result);
			if (result < 0) result = 0;
			if (result >= STOOP_FRAMES.length) result = STOOP_FRAMES.length - 1;
			return result;
			
		}
		
		private function onKeyDown(e:KeyboardEvent):void {
			
			
			if (e.keyCode == Keyboard.G && _lastKey == Keyboard.G) {
				_pressed = (_timeSincePress < MAX_KEY_DELAY);
				_timeSincePress = 0;
			}
			else if (e.keyCode == Keyboard.H && _lastKey == Keyboard.H) {
				_pressed = (_timeSincePress < MAX_KEY_DELAY);
				_timeSincePress = 0;
			}
			else if (e.keyCode == Keyboard.ESCAPE) {
				FlxG.switchState(new Menu);
			}
			
			_lastKey = e.keyCode;
			
		}
		
		
		public override function destroy():void {
			
			if (_tantalus) _tantalus.destroy();
			
			if (_fruitText && FlxG.stage.contains(_fruitText)) FlxG.stage.removeChild(_fruitText);
			if (_waterText && FlxG.stage.contains(_waterText)) FlxG.stage.removeChild(_waterText);
			
			FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);
			
			if (_fruitInstructionsText && FlxG.stage.contains(_fruitInstructionsText)) FlxG.stage.removeChild(_fruitInstructionsText);
			if (_waterInstructionsText && FlxG.stage.contains(_waterInstructionsText)) FlxG.stage.removeChild(_waterInstructionsText);
			
			super.destroy();
			
		}
		
	}
}