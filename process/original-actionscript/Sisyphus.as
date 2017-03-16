package
{
	
	import flash.events.KeyboardEvent;
	import flash.text.*;
	import flash.ui.Keyboard;
	
	import org.flixel.*;
	
	public class Sisyphus extends FlxState {
		
		private const START:uint = 0;
		private const BOTTOM:uint = 1;
		private const UPHILL:uint = 2;
		private const DOWNHILL:uint = 3;
		private const REVERT:uint = 4;
		
		[Embed(source="assets/sprites/sisyphus/sisyphus.png")]
		private const SISYPHUS_ANIMATION:Class;
		
		[Embed(source="assets/fonts/Commodore Pixelized v1.2.ttf", fontName="COMMODORE", fontWeight="Regular", embedAsCFF="false")]
		public static const COMMODORE_FONT:Class;
		
		private const MAX_KEY_DELAY:Number = 0.12;
		
		private const SISYPHUS_START_FRAMES:Array = new Array(
			0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,
		    23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,
		    43,44,45,46,47,48,49,50,51);
		private const SISYPHUS_UPHILL_FRAMES:Array = new Array(
			51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,
			71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,
			91,92,93,94,95);
		private const SISYPHUS_DOWNHILL_FRAMES:Array = new Array(
			95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,
		    75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,
		    55,54,53,52,51);
		
		private const SCORE_PREFIX:String = "FAILURES: ";
		
		private var _sisyphus:FlxSprite;
		
		private var _score:uint = 0;
		private var _scoreText:TextField;
		private var _scoreFormat:TextFormat = new TextFormat("COMMODORE",32,0xFFFFFF,null,null,null,null,null,"left");
		
		private var _instructionsText:TextField;
		private var _instructionsTextFormat:TextFormat = new TextFormat("COMMODORE",24,0x000000,null,null,null,null,null,"center");
		private const INSTRUCTIONS_TEXT:String = "RAPIDLY ALTERNATE THE 'G' AND 'H' KEYS TO PUSH THE BOULDER UP THE HILL!";
		
		private var _lastKey:uint = Keyboard.H;
		private var _timeSincePress:Number = 0;
		private var _pressed:Boolean = false;
		
		private var _state:uint = START;
		private var _currentFrame:int = 0;
		
		public function Sisyphus() {
		}
		
		public override function create():void {
			
			FlxG.bgColor = 0xFFAAAAFF;
						
			_sisyphus = new FlxSprite();
			_sisyphus.loadGraphic(SISYPHUS_ANIMATION,true,false,200,100);
			_sisyphus.addAnimation("start",SISYPHUS_START_FRAMES,8,false);
			_sisyphus.addAnimation("uphill",SISYPHUS_UPHILL_FRAMES,8,false);
			_sisyphus.addAnimation("downhill",SISYPHUS_DOWNHILL_FRAMES,8,false);
			_sisyphus.addAnimation("fastdownhill",SISYPHUS_DOWNHILL_FRAMES,30,false);
			_sisyphus.x = 0; _sisyphus.y = 0;
			_sisyphus.frame = 0;
			
			_scoreText = Helpers.makeTextField(105,FlxG.height - 15,FlxG.width,FlxG.height,SCORE_PREFIX + _score.toString(),_scoreFormat);
			_scoreText.rotation = -45;
			
			_instructionsText = Helpers.makeTextField(15,20,FlxG.width - 100,FlxG.height,INSTRUCTIONS_TEXT,_instructionsTextFormat);

			this.add(_sisyphus);
			FlxG.stage.addChild(_scoreText);
			FlxG.stage.addChild(_instructionsText);
			
			FlxG.stage.addEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);
			
			super.create();
			
		}
		
		
		public override function update():void {
						
			_timeSincePress += FlxG.elapsed;
			
			if (_state == START && _sisyphus.finished) {
				trace("START AND FINISHED");
				_state = BOTTOM;
				_sisyphus.play("uphill");
			}
			else if (_state == DOWNHILL && _sisyphus.finished) {
				trace("DOWNHILL AND FINISHED");
				_state = BOTTOM;
			}
			else if (_state == UPHILL && _sisyphus.finished) {
				_state = REVERT;
				Assets.swoopDown.volume = 1;
				Assets.swoopDown.play();
				_sisyphus.play("fastdownhill");
			}
			else if (_state == REVERT && _sisyphus.finished) {
				_state = BOTTOM;
				_score++;
				_scoreText.text = SCORE_PREFIX + _score.toString();
				Assets.peck.volume = 1;
				Assets.peck.play();
				if (FlxG.stage.contains(_instructionsText)) {
					FlxG.stage.removeChild(_instructionsText);
					FlxG.stage.focus = null;
				}
			}
			
			if (_pressed) {
				if (_state == START) {
					trace("START AND KEYS");
					if (_currentFrame == SISYPHUS_START_FRAMES.length - 1) _currentFrame--;
					_sisyphus.playFromFrame("start",false,_currentFrame + 1);
				}
				else if (_state == UPHILL) {
					trace("UPHILL AND KEYS");
					//_sisyphus.playFromFrame("uphill",false,_sisyphus.frame);
				}
				else if (_state == BOTTOM) {
					trace("BOTTOM AND KEYS");
					_state = UPHILL;
					_sisyphus.play("uphill");
				}
				else if (_state == DOWNHILL) {
					trace("DOWNHILL AND KEYS");
					_state = UPHILL;
					_sisyphus.playFromFrame("uphill",false,convertDownhillToUphill(_sisyphus.frame - 1));
				}
			}
			else {
				if (_state == START) {
					trace("START AND NO KEYS");
					_sisyphus.frame = _currentFrame;
				}
				else if (_state == UPHILL) {
					trace("UPHILL AND NO KEYS");
					_state = DOWNHILL;
					_sisyphus.playFromFrame("downhill",false,convertUphillToDownhill(_sisyphus.frame + 1));
				}
			}
			
			if (_timeSincePress > MAX_KEY_DELAY) _pressed = false;
	
			_currentFrame = _sisyphus.frame;
			
			super.update();
			
		}
		
		
		private function convertUphillToDownhill(f:int):int {
			
			var result:int = (SISYPHUS_UPHILL_FRAMES.length - 1 - (f - 51));
			trace(f + " --> " + result);
			if (result >= SISYPHUS_DOWNHILL_FRAMES.length) result = SISYPHUS_DOWNHILL_FRAMES.length - 1;
			if (result < 0) result = 0;
			return result;
			
		}
		
		
		private function convertDownhillToUphill(f:int):int {
			
			var result:int = (f - 51);
			trace(f + " --> " + result);
			if (result < 0) result = 0;
			if (result >= SISYPHUS_UPHILL_FRAMES.length) result = SISYPHUS_UPHILL_FRAMES.length - 1;
			return result;
			
		}
		
		
		private function onKeyDown(e:KeyboardEvent):void {
			
			if (e.keyCode == Keyboard.G && _lastKey == Keyboard.H) {
				_pressed = (_timeSincePress < MAX_KEY_DELAY);
				_timeSincePress = 0;
			}
			else if (e.keyCode == Keyboard.H && _lastKey == Keyboard.G) {
				_pressed = (_timeSincePress < MAX_KEY_DELAY);
				_timeSincePress = 0;
			}
			else if (e.keyCode == Keyboard.ESCAPE) {
				FlxG.switchState(new Menu);
			}
			
			_lastKey = e.keyCode;
		}
		
		
		public override function destroy():void {
			
			if (_sisyphus) _sisyphus.destroy();
			
			if (_instructionsText && FlxG.stage.contains(_instructionsText)) FlxG.stage.removeChild(_instructionsText);
			if (_scoreText && FlxG.stage.contains(_scoreText)) FlxG.stage.removeChild(_scoreText);
			
			FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);
			
			super.destroy();
			
		}
		
	}
}