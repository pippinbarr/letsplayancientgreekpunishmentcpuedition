package
{

	import flash.events.KeyboardEvent;
	import flash.sampler.startSampling;
	import flash.text.*;
	import flash.ui.Keyboard;

	import org.flixel.*;

	public class Zeno extends FlxState {

		[Embed(source="assets/sprites/zeno/zeno.png")]
		private const ZENO_ANIMATION:Class;

		[Embed(source="assets/sprites/zeno/flag.png")]
		private const FLAG_SPRITE:Class;

		[Embed(source="assets/sprites/zeno/ground.png")]
		private const GROUND_SPRITE:Class;

		[Embed(source="assets/fonts/Commodore Pixelized v1.2.ttf", fontName="COMMODORE", fontWeight="Regular", embedAsCFF="false")]
		public static const COMMODORE_FONT:Class;

		private const READY:uint = 0;
		private const RUNNING:uint = 1;
		private const PRECELEBRATING:uint = 2;
		private const CELEBRATING:uint = 3;
		private const REVERT:uint = 4;
		private const PREUNCELEBRATING:uint = 5;
		private const UNCELEBRATING:uint = 6;

		private const MAX_KEY_DELAY:Number = 0.15;

		private const ZENO_IDLE_FRAMES:Array = new Array(
			3,3
			);
		private const ZENO_RUNNING_FRAMES:Array = new Array(
			0,1,2
			);
		private const ZENO_CELEBRATE_FRAMES:Array = new Array(
			3,4,5,6,7
			);
		private const ZENO_UNCELEBRATE_FRAMES:Array = new Array(
			7,6,5,4,3
			);


		private const ZENO_START_X:uint = 10;
		private const ZENO_HALFWAY_X:uint = 88;

		private var _zeno:FlxSprite;
		private var _flag:FlxSprite;
		private var _ground:FlxSprite;

		private var _instructionsText:TextField;
		private var _instructionsTextFormat:TextFormat = new TextFormat("COMMODORE",24,0x000000,null,null,null,null,null,"center");
		private const INSTRUCTIONS_TEXT:String = "RAPIDLY ALTERNATE THE 'G' AND 'H' KEYS TO RUN THE RACE!";

		private var _start:Number = 0;
		private var _startText:TextField;
		private var _halfWay:Number = 50;
		private var _halfWayText:TextField;
		private var _finish:Number = 100;
		private var _finishText:TextField;
		private var _halfWayAnnounceText:TextField;
		private var _textFormat:TextFormat = new TextFormat("COMMODORE",18,0xFFFFFF,null,null,null,null,null,"left");
		private var _announceTextFormat:TextFormat = new TextFormat("COMMODORE",24,0x000000,null,null,null,null,null,"center");

		private var _lastKey:uint = Keyboard.H;
		private var _frameCount:uint = 0;
		private var _keyCount:uint = 0;

		private var _currentFrame:int = 0;

		private var _timer:FlxTimer;
		private var _timeSincePress:Number = 0;
		private var _pressed:Boolean = false;

		private var _halves:Number = 100;
		private var _halfMore:Number = 50;

		private var _state:uint = RUNNING;

		public function Zeno() {
		}

		public override function create():void {

			FlxG.bgColor = 0xFFDDAADD;

			_timer = new FlxTimer();

			_zeno = new FlxSprite();
			_zeno.loadGraphic(ZENO_ANIMATION,true,false,20,22);
			_zeno.addAnimation("idle",ZENO_IDLE_FRAMES,5,false);
			_zeno.addAnimation("run5",ZENO_RUNNING_FRAMES,5,true);
			_zeno.addAnimation("run10",ZENO_RUNNING_FRAMES,10,true);
			_zeno.addAnimation("run15",ZENO_RUNNING_FRAMES,15,true);
			_zeno.addAnimation("run20",ZENO_RUNNING_FRAMES,20,true);
			_zeno.addAnimation("celebrate",ZENO_CELEBRATE_FRAMES,10,false);
			_zeno.addAnimation("uncelebrate",ZENO_UNCELEBRATE_FRAMES,10,false);
			_zeno.x = ZENO_START_X; _zeno.y = 58;
			_zeno.play("idle");

			_flag = new FlxSprite();
			_flag.loadGraphic(FLAG_SPRITE);
			_flag.x = 180; _flag.y = 49;

			_ground = new FlxSprite();
			_ground.loadGraphic(GROUND_SPRITE);
			_ground.x = 0; _ground.y = 0;

			_startText = Helpers.makeTextField(15,82,FlxG.width,FlxG.height,_start.toString() + "m",_textFormat);
			_halfWayText = Helpers.makeTextField(95,82,FlxG.width,FlxG.height,_halfWay.toString() + "m",_textFormat);
			_finishText = Helpers.makeTextField(180,82,FlxG.width,FlxG.height,_finish.toString() + "m",_textFormat);
			_halfWayAnnounceText = Helpers.makeTextField(0,40,FlxG.width,FlxG.height,"HALF-WAY THERE!",_announceTextFormat);

			_instructionsText = Helpers.makeTextField(50,20,FlxG.width - 100,FlxG.height,INSTRUCTIONS_TEXT,_instructionsTextFormat);

			this.add(_zeno);
			this.add(_flag);
			this.add(_ground);

			FlxG.stage.addChild(_startText);
			FlxG.stage.addChild(_halfWayText);
			FlxG.stage.addChild(_finishText);
			FlxG.stage.addChild(_instructionsText);

			FlxG.stage.addEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);

			super.create();

		}


		public override function update():void {

			_timeSincePress += FlxG.elapsed;

			if (_zeno.x >= 50 && FlxG.stage.contains(_instructionsText)) {
				FlxG.stage.removeChild(_instructionsText);
				FlxG.stage.focus = null;
			}

			if (_zeno.x >= ZENO_HALFWAY_X && _state != PRECELEBRATING && _state != CELEBRATING && _state != REVERT) {
				_zeno.play("idle");
				_state = PRECELEBRATING;
				_timer.start(1,1,celebrate);
			}
			else if (_state == CELEBRATING && _zeno.finished) {
				_state = REVERT;
				_startText.visible = false;
				_startText.text = _halfWayText.text;
			}
			else if (_state == UNCELEBRATING && _zeno.finished) {
				_state = RUNNING;
				_zeno.play("idle");
				_halfMore = _halfMore / 2;
				_halfWay = _halfWay + _halfMore;
				if (_halfWay < 99.9999999999999) {
					_halfWayText.text = _halfWay.toString() + "m";
				}
				else {
					if (_startText.text == "HALF-WAY") {
						_startText.text = "ALMOST\nHALF-WAY";
					}
					_halfWayText.text = "HALF-WAY";
				}
				_halfWayText.visible = true;
				_halfWayText.x = 95 * Globals.ZOOM;
			}
			else if (_state == RUNNING) {
				if (_pressed) {
					if (_halves > 10) {
						_zeno.play("run5");
						_zeno.x += 0.2;
					}
					else if (_halves > 1) {
						_zeno.play("run10");
						_zeno.x += 0.5;
					}
					else if (_halves > 0.1) {
						_zeno.play("run15");
						_zeno.x += 1.0;
					}
					else {
						_zeno.play("run20");
						_zeno.x += 2.0;
					}
				}
				else {
					_zeno.play("idle");
				}
			}
			else if (_state == REVERT) {
				if (_zeno.x > ZENO_START_X) {
					_zeno.x -= 0.5;
					_halfWayText.x -= 0.5 * Globals.ZOOM;
				}
				else {
					_startText.visible = true;
					_halfWayText.visible = false;
					_state = PREUNCELEBRATING;
					_timer.start(1,1,uncelebrate);
				}
			}

			_frameCount = (_frameCount + 1) % FlxG.framerate;
			if (_frameCount == 0) _keyCount = 0;

			_currentFrame = _zeno.frame;

			if (_timeSincePress > MAX_KEY_DELAY) _pressed = false;

			super.update();

		}


		private function celebrate(t:FlxTimer):void {

			_state = CELEBRATING;
			_zeno.play("celebrate");
			Assets.victory.volume = 1;
			Assets.victory.play();
			FlxG.stage.addChild(_halfWayAnnounceText);

		}


		private function uncelebrate(t:FlxTimer):void {
			_halves = _halves/2;
			_state = UNCELEBRATING;
			_zeno.play("uncelebrate");
			Assets.swoopDown.volume = 1;
			Assets.swoopDown.play();
			FlxG.stage.removeChild(_halfWayAnnounceText);
		}


		private function onKeyDown(e:KeyboardEvent):void {

			if (e.keyCode == Keyboard.G && _lastKey == Keyboard.H) {
				_keyCount++;
				_pressed = (_timeSincePress < MAX_KEY_DELAY);
				_timeSincePress = 0;
			}
			else if (e.keyCode == Keyboard.H && _lastKey == Keyboard.G) {
				_keyCount++;
				_pressed = (_timeSincePress < MAX_KEY_DELAY);
				_timeSincePress = 0;
			}
			else if (e.keyCode == Keyboard.ESCAPE)
			{
				FlxG.switchState(new Menu);
			}


			_lastKey = e.keyCode;

		}


		public override function destroy():void {

			if (_zeno) _zeno.destroy();
			if (_flag) _flag.destroy();

			if (_startText && FlxG.stage.contains(_startText)) FlxG.stage.removeChild(_startText);
			if (_halfWayText && FlxG.stage.contains(_halfWayText)) FlxG.stage.removeChild(_halfWayText);
			if (_finishText && FlxG.stage.contains(_finishText)) FlxG.stage.removeChild(_finishText);

			if (_instructionsText && FlxG.stage.contains(_instructionsText)) FlxG.stage.removeChild(_instructionsText);
			if (_halfWayAnnounceText && FlxG.stage.contains(_halfWayAnnounceText)) FlxG.stage.removeChild(_halfWayAnnounceText);

			FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);

			super.destroy();

		}

	}
}
