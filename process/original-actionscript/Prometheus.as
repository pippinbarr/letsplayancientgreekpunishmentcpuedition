package
{
	
	import flash.events.KeyboardEvent;
	import flash.sampler.startSampling;
	import flash.text.*;
	import flash.ui.Keyboard;
	
	import org.flixel.*;
	
	public class Prometheus extends FlxState {
		
		[Embed(source="assets/sprites/prometheus/prometheus.png")]
		private const PROMETHEUS_ANIMATION:Class;
		
		[Embed(source="assets/sprites/prometheus/eagle.png")]
		private const EAGLE_ANIMATION:Class;
		
		[Embed(source="assets/sprites/prometheus/rockandchains.png")]
		private const ROCK_AND_CHAINS_SPRITE:Class;
		
		[Embed(source="assets/fonts/Commodore Pixelized v1.2.ttf", fontName="COMMODORE", fontWeight="Regular", embedAsCFF="false")]
		public static const COMMODORE_FONT:Class;
		
		private const MAX_KEY_DELAY:Number = 0.3;
		
		private const START:uint = 0;
		private const PERCHED:uint = 1;
		private const PECKING:uint = 2;
		private const FLAP_UP:uint = 3;
		private const FLAP_DOWN:uint = 4;
		private const HOVER:uint = 5;
		private const PREDEPARTURE:uint = 9;
		private const DEPARTING:uint = 6;
		private const DEPARTED:uint = 8;
		private const NIGHT:uint = 7;
		
		private const PROMETHEUS_WRITHING_FRAMES:Array = new Array(
			1,0
			);
		
		private const EAGLE_FLYING_FRAMES:Array = new Array(
			0,1,2,3
			);
		
		private const EAGLE_PECKING_FRAMES:Array = new Array(
			5,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,5,4,4,4,5,4,4,4,4,4,4,5,4,4,4,4,4,5,4,4,4
			);
		
		private const ROCK_AND_CHAINS_DAY_FRAME:uint = 0;
		private const ROCK_AND_CHAINS_NIGHT_FRAME:uint = 1;
		private const PROMETHEUS_NIGHT_FRAME:uint = 2;
		
		private const EAGLE_LAND_Y:uint = 50;
		private const EAGLE_FLAP_HEIGHT:uint = 40;
		
		private const LIVER_PREFIX:String = "LIVER: ";
		private const DAYS_PREFIX:String = "DAYS: ";
		
		private var _prometheus:FlxSprite;
		private var _eagle:FlxSprite;
		private var _rockAndChains:FlxSprite;
		
		private var _days:uint = 0;
		private var _daysText:TextField;
		private var _liver:uint = 100;
		private var _liverText:TextField;
		private var _textFormat:TextFormat = new TextFormat("COMMODORE",32,0x000000,null,null,null,null,null,"left");
		
		private var _instructionsText:TextField;
		private var _instructionsTextFormat:TextFormat = new TextFormat("COMMODORE",24,0x000000,null,null,null,null,null,"center");
		private const INSTRUCTIONS_TEXT:String = "RAPIDLY ALTERNATE THE 'G' AND 'H' KEYS TO WRITHE IN PAIN AND DISLODGE THE EAGLE!";
		
		private var _lastKey:uint = Keyboard.H;
		private var _timeSincePress:Number = 0;
		private var _pressed:Boolean = false;
		
		private var _currentFrame:int = 0;
		
		private var _pecked:Boolean = false;
		
		private var _timer:FlxTimer;
		
		private var _state:uint = 999;
		
		public function Prometheus() {
		}
		
		public override function create():void {
			
			FlxG.bgColor = 0xFFFFAAAA;
			
			_timer = new FlxTimer();
			
			_prometheus = new FlxSprite();
			_prometheus.loadGraphic(PROMETHEUS_ANIMATION,true,false,21,10);
			_prometheus.addAnimation("still",[0,0],5,false);
			_prometheus.addAnimation("night",[2,2],5,false);
			_prometheus.addAnimation("writhe",PROMETHEUS_WRITHING_FRAMES,5,false);
			_prometheus.x = 90; _prometheus.y = 55;
			_prometheus.play("still");
			
			_rockAndChains = new FlxSprite();
			_rockAndChains.loadGraphic(ROCK_AND_CHAINS_SPRITE,true,false,200,100);
			_rockAndChains.frame = ROCK_AND_CHAINS_DAY_FRAME;
			_rockAndChains.x = 0; _rockAndChains.y = 0;
			
			_eagle = new FlxSprite();
			_eagle.loadGraphic(EAGLE_ANIMATION,true,false,12,11);
			_eagle.addAnimation("fly",EAGLE_FLYING_FRAMES,5,true);
			_eagle.addAnimation("perch",[4,4],5,false);
			_eagle.addAnimation("peck",EAGLE_PECKING_FRAMES,5,true);
			_eagle.x = 22; _eagle.y = -20;
			_eagle.play("fly");
			
			_liverText = Helpers.makeTextField(15,58,FlxG.width,FlxG.height,LIVER_PREFIX + _liver.toString() + "%",_textFormat);
			_daysText = Helpers.makeTextField(125,58,FlxG.width,FlxG.height,DAYS_PREFIX + _days.toString(),_textFormat);

			_instructionsText = Helpers.makeTextField(50,20,FlxG.width - 100,FlxG.height,INSTRUCTIONS_TEXT,_instructionsTextFormat);

			this.add(_prometheus);
			this.add(_rockAndChains);
			this.add(_eagle);
			
			FlxG.stage.addChild(_liverText);
			FlxG.stage.addChild(_daysText);
			
			FlxG.stage.addChild(_instructionsText);
			
			FlxG.stage.addEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);
			
			_timer.start(2,1,start);
			
			super.create();
			
		}
		
		
		public override function update():void {
			
			trace("State: " + _state);
			
			_timeSincePress += FlxG.elapsed;
			
			if (_liver == 0 && _state != PREDEPARTURE && _state != DEPARTING && _state != DEPARTED) {
				_state = PREDEPARTURE;
				_eagle.play("perch");
				_timer.start(2,1,depart);
			}

			
			if (_state == START) {
				if (_eagle.y < EAGLE_LAND_Y) {
					_eagle.x += 0.3; _eagle.y += 0.3;
				}
				else {
					_state = PERCHED;
					_eagle.play("perch");
					_timer.start(Math.random() * 2 + 1,1,peck);
				}
			}
			else if (_state == PECKING || _state == PERCHED) {
				if (_eagle.frame == 5 && !_pecked) {
					_liver -= 5;
					_liverText.text = LIVER_PREFIX + _liver + "%";
					_pecked = true;
					Assets.peck.volume = 1;
					Assets.peck.play();
				}
				else if (_eagle.frame == 4) {
					_pecked = false;
				}
				if (_pressed) {
					_timer.stop();
					_state = FLAP_UP;
					_eagle.play("fly");
				}
			}
			else if (_state == FLAP_UP) {
				if (_eagle.y >= EAGLE_FLAP_HEIGHT) {
					_eagle.y -= 0.3;
				}
				else {
					_state = HOVER;
					_timer.start(Math.random() * 3,1,flapDown);
				}
			}
			else if (_state == FLAP_DOWN) {
				if (FlxG.stage.contains(_instructionsText)) {
					FlxG.stage.removeChild(_instructionsText);
					FlxG.stage.focus = null;
				}
				if (_eagle.y < EAGLE_LAND_Y) {
					_eagle.y += 0.3;
				}
				else {
					_state = PERCHED;
					_eagle.play("perch");
					_timer.start(Math.random() * 2 + 1,1,peck);
				}
			}
			else if (_state == DEPARTING) {
				if (_eagle.y > -10) {
					_eagle.x += 0.3; _eagle.y -= 0.3;
				}
				else {
					_state = DEPARTED;
					_timer.start(2,1,nightFall);
				}
			}
		
			if (_state != NIGHT) {
				if (_pressed) {
					_prometheus.play("writhe");
				}
				else {
					_prometheus.play("still");
				}
			}
			

			if (_timeSincePress > MAX_KEY_DELAY) _pressed = false;
			
			_currentFrame = _prometheus.frame;
			
			super.update();
			
		}
		
		private function peck(t:FlxTimer):void {
			
			_eagle.play("peck");
			_state = PECKING;
			
		}
		
		private function flapDown(t:FlxTimer):void {
			
			_state = FLAP_DOWN;
			
		}
		
		private function depart(t:FlxTimer):void {
			
			_state = DEPARTING;
			_eagle.play("fly");
			
		}
		
		private function nightFall(t:FlxTimer):void {
			
			trace("Nightfall...");
			_state = NIGHT;
			_liverText.visible = false;
			_daysText.visible = false;
			_liver = 100;
			_days++;
			_prometheus.play("night");
			_rockAndChains.frame = ROCK_AND_CHAINS_NIGHT_FRAME;
			
			_timer.start(5,1,dayTime);
			
		}
		
		private function dayTime(t:FlxTimer):void {
			
			_eagle.x = 22; _eagle.y = -20;
			_eagle.play("fly");
			_rockAndChains.frame = ROCK_AND_CHAINS_DAY_FRAME;
			_prometheus.frame = 0;
			_liverText.visible = true;
			_daysText.visible = true;
			_liverText.text = LIVER_PREFIX + _liver + "%";
			_daysText.text = DAYS_PREFIX + _days;
			_timer.start(1,1,start);
			Assets.swoopDown.volume = 1;
			Assets.swoopDown.play();
			
		}
		
		private function start(t:FlxTimer):void {
			
			_state = START;
			
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
			
			if (_prometheus) _prometheus.destroy();
			
			if (_liverText && FlxG.stage.contains(_liverText)) FlxG.stage.removeChild(_liverText);
			if (_daysText && FlxG.stage.contains(_daysText)) FlxG.stage.removeChild(_daysText);
			
			FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);
			
			if (_instructionsText && FlxG.stage.contains(_instructionsText)) FlxG.stage.removeChild(_instructionsText);
			
			super.destroy();
			
		}
		
	}
}