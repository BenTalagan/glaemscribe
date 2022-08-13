# encoding: UTF-8
#
# Glǽmscribe (also written Glaemscribe) is a software dedicated to
# the transcription of texts between writing systems, and more 
# specifically dedicated to the transcription of J.R.R. Tolkien's 
# invented languages to some of his devised writing systems.
# 
# Copyright (C) 2015 Benjamin Babut (Talagan).
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

module Glaemscribe
  module API
    
    class ModeParser
    
      def initialize
        @mode = nil
      end
      
      def validate_presence_of_args(node, arg_count = nil)
        if(arg_count)
          if(node.args.count != arg_count)
            @mode.errors << Glaeml::Error.new(node.line,"Element '#{node.name}' should have #{arg_count} arguments.")
          end
        end
      end
      
      def validate_presence_of_children(parent_node, elt_name, elt_count = nil, arg_count = nil)
        res = parent_node.gpath(elt_name)
        if(elt_count)
          if(res.count != elt_count)
            @mode.errors << Glaeml::Error.new(parent_node.line,"Element '#{parent_node.name}' should have exactly #{elt_count} children of type '#{elt_name}'.")
          end
        end
        if(arg_count)
          res.each{ |child_node|
            validate_presence_of_args(child_node, arg_count)
          }
        end
      end
      
      # Very simplified 'dtd' like verification
      def verify_mode_glaeml(doc)
        validate_presence_of_children(doc.root_node, "language", 1, 1)
        validate_presence_of_children(doc.root_node, "writing", 1, 1)
        validate_presence_of_children(doc.root_node, "mode", 1, 1)
        validate_presence_of_children(doc.root_node, "authors", 1, 1)
        validate_presence_of_children(doc.root_node, "version", 1, 1)
       
        doc.root_node.gpath("charset").each{ |charset_element|
          validate_presence_of_args(charset_element, 2)        
        }
       
        doc.root_node.gpath("options.option").each{ |option_element|
          validate_presence_of_args(option_element, 2)
          option_element.gpath("value").each{ |value_element|
            validate_presence_of_args(value_element, 2)
          }
        }
        
        doc.root_node.gpath("postprocessor.outspace").each{ |outspace_element|
          validate_presence_of_args(outspace_element, 1)          
        }
        
        doc.root_node.gpath("processor.rules").each{ |rules_element|
          validate_presence_of_args(rules_element, 1)       
          validate_presence_of_children(rules_element,"if",nil,1);  
          validate_presence_of_children(rules_element,"elsif",nil,1);  
        }        

        doc.root_node.gpath("preprocessor.if").each{ |e| validate_presence_of_args(e,  1) }    
        doc.root_node.gpath("preprocessor.elsif").each{ |e| validate_presence_of_args(e,  1) }    
        doc.root_node.gpath("postprocessor.if").each{ |e| validate_presence_of_args(e,  1) }    
        doc.root_node.gpath("postprocessor.elsif").each{ |e| validate_presence_of_args(e,  1) }  
        
        doc.root_node.children.each { |c|
          @mode.errors << Glaeml::Error.new(c.line, "'if' conditions are not allowed in that scope.") if c.name == 'if'
        }  
      end
      
      def create_if_cond_for_if_term(line, if_term, cond)      
        ifcond                          = IfTree::IfCond.new(line, if_term, cond)
        child_code_block                = IfTree::CodeBlock.new(ifcond)
        ifcond.child_code_block         = child_code_block                
        if_term.if_conds << ifcond 
        ifcond            
      end
      
      def traverse_if_tree(context, text_procedure, element_procedure)

        owner         = context[:owner]           # The root object of the if tree
        root_element  = context[:root_element]    # The glaeml root_element of that if tree
        rule_group    = context[:rule_group]      # The rule group in which this traversal happens (may be null for pre/post processors)

        root_code_block           = owner.root_code_block
        current_parent_code_block = root_code_block
        
        root_element.children.each{ |child|
          if(child.text?)
            # Do something with this text 
            text_procedure.call(current_parent_code_block, child)           
          elsif(child.element?)
            case child.name
            when 'if'
              cond_attribute                  = child.args.first
              if_term                         = IfTree::IfTerm.new(current_parent_code_block)
              current_parent_code_block.terms << if_term                  
              if_cond                         = create_if_cond_for_if_term(child.line, if_term, cond_attribute)             
              current_parent_code_block       = if_cond.child_code_block
             
            when 'elsif'
             
              cond_attribute                  = child.args.first
              if_term                         = current_parent_code_block.parent_if_cond.parent_if_term  
              
              if !if_term
                @mode.errors << Glaeml::Error.new(child.line, " 'elsif' without a 'if'.")
                return
              end
              
              # TODO : check that precendent one is a elsif, not a else
              if_cond                         = create_if_cond_for_if_term(child.line, if_term, cond_attribute)             
              current_parent_code_block       = if_cond.child_code_block                                       
              
            when 'else'
              
              if_term                         = current_parent_code_block.parent_if_cond.parent_if_term  
              
              if !if_term
                @mode.errors << Glaeml::Error.new(child.line, " 'else' without a 'if'.")
                return
              end
              
              if_cond                         = create_if_cond_for_if_term(child.line, if_term, "true")             
              current_parent_code_block       = if_cond.child_code_block
                                                              
            when 'endif'
              if_term                         = current_parent_code_block.parent_if_cond.parent_if_term  
            
              if !if_term
                @mode.errors << Glaeml::Error.new(child.line, " 'endif' without a 'if'.")
                return
              end
              
              current_parent_code_block       = if_term.parent_code_block
            when 'macro'
        
              # Macro definition, cannot be defined in conditional blocks
              if current_parent_code_block.parent_if_cond || root_element.name != "rules"
                @mode.errors << Glaeml::Error.new(child.line, "Macros can only defined in the 'rules' scope, not in a conditional block (because they are replaced and used at parsing time) or a macro block (local macros are not handled).")
                return
              end
              
              if !child.args || child.args.count == 0
                @mode.errors << Glaeml::Error.new(child.line, "Macro misses a name.")
                return   
              end

              macro_args = child.args.clone
              macro_name = macro_args.shift
              macro_args.each{ |arg|
                if(!arg =~ /[0-9A-Z_]+/)
                  @mode.errors << Glaeml::Error.new(child.line, "Macro argument name #{arg} has wrong format.")
                  return
                end
              }
              
              if rule_group.macros[macro_name]
                @mode.errors << Glaeml::Error.new(child.line, "Redefining macro #{macro_name}.")
                return
              end
              
              macro = Macro.new(rule_group,macro_name,macro_args)
              macro_context = {:owner => macro, :root_element => child, :rule_group => rule_group}
              traverse_if_tree(macro_context, text_procedure, element_procedure)

              rule_group.macros[macro_name] = macro

            when 'deploy'

              if !rule_group
                @mode.errors << Glaeml::Error.new(child.line, "Macros can only be deployed in a rule group.")
                return
              end

              macro_args = child.args.clone
              macro_name = macro_args.shift
              macro      = rule_group.macros[macro_name]

              if !macro
                @mode.errors << Glaeml::Error.new(child.line, "Macro '#{macro_name}' not found in rule group '#{rule_group.name}'.")
                return
              end

              wanted_argcount = macro.arg_names.count
              given_argcount  = macro_args.count
              if wanted_argcount != given_argcount
                @mode.errors << Glaeml::Error.new(child.line, "Macro '#{macro_name}' takes #{wanted_argcount} arguments, not #{given_argcount}.")
                return
              end

              macro_node = IfTree::MacroDeployTerm.new(macro, child.line, current_parent_code_block, macro_args)
              current_parent_code_block.terms << macro_node

            else
              # Do something with this child element
              element_procedure.call(current_parent_code_block, child)            
            end
          end
        }
        
        if(current_parent_code_block.parent_if_cond)
          @mode.errors <<  Glaeml::Error.new(root_element.line, "Unended 'if' at the end of this '#{root_element.name}' element.")
        end
      end
            
      def parse_pre_post_processor(processor_element, pre_not_post)
        # Do nothing with text elements
        text_procedure = Proc.new { |current_parent_code_block, element| }           
        
        element_procedure = Proc.new { |current_parent_code_block, element|
          
          # A block of code lines. Put them in a codelinesterm.   
          term = current_parent_code_block.terms.last
          if(!term || !term.is_pre_post_processor_operators?)
            term = IfTree::PrePostProcessorOperatorsTerm.new(current_parent_code_block) 
            current_parent_code_block.terms << term
          end
          
          operator_name   = element.name      
          operator_class  = if pre_not_post
            ResourceManager::class_for_pre_processor_operator_name(operator_name)
          else
            ResourceManager::class_for_post_processor_operator_name(operator_name)
          end
          
          if !operator_class
            @mode.errors << Glaeml::Error.new(element.line,"Operator #{operator_name} is unknown.")
          else            
            term.operators << operator_class.new(@mode, element.clone)
          end  
        }  

        processor_context = {
            owner: ((pre_not_post)?(@mode.pre_processor):(@mode.post_processor)),
            root_element: processor_element,
            rule_group: nil
        }
        traverse_if_tree(processor_context, text_procedure, element_procedure )
      end
      
      def parse(file_path, mode_options = {})
              
        @mode = Mode.new(ResourceManager::mode_name_from_file_path(file_path))        
              
        raw   = File.open(file_path,"rb:utf-8").read
        doc   = Glaeml::Parser.new.parse(raw)
        
        if(doc.errors.any?)
          @mode.errors = doc.errors
          return @mode
        end
        
        verify_mode_glaeml(doc)
        
        return @mode if(@mode.errors.any?)
        
        # Get the attributes of the mode
        @mode.language      = doc.root_node.gpath('language').first.args.first
        @mode.writing       = doc.root_node.gpath('writing').first.args.first
        @mode.human_name    = doc.root_node.gpath('mode').first.args.first
        @mode.authors       = doc.root_node.gpath('authors').first.args.first
        @mode.version       = doc.root_node.gpath('version').first.args.first
        @mode.raw_mode_name = doc.root_node.gpath('raw_mode').first.args.first if doc.root_node.gpath('raw_mode').first
        @mode.invention     = doc.root_node.gpath('invention').first.args.first if doc.root_node.gpath('invention').first
        @mode.world         = doc.root_node.gpath('world').first.args.first if doc.root_node.gpath('world').first
                
        doc.root_node.gpath("options.option").each{ |option_element|
          values      = {}
          visibility  = nil
          is_radio    = false
  
          option_element.gpath("value").each{ |value_element|
            value_name                = value_element.args.first
            values[value_name]        = value_element.args.last.to_i
          }
          option_element.gpath("visible_when").each{ |visible_element|
            visibility = visible_element.args.first
          }
          
          option_element.gpath('radio').each{|e| is_radio = true}
        
          option_name_at          = option_element.args[0]
          option_default_val_at   = option_element.args[1]
          # TODO: check syntax of the option name
          
          if(option_default_val_at.nil?)
            @mode.errors << Glaeml::Error.new(option_element.line, "Missing option default value.")
          end
            
          option                      = Option.new(@mode, option_name_at, option_default_val_at, values, option_element.line, visibility)
          option.is_radio             = is_radio
          @mode.options[option.name]  = option
        }
        
        # Read the supported font list
        doc.root_node.gpath("charset").each { |charset_element|
          charset_name                      = charset_element.args.first
          charset                           = ResourceManager::charset(charset_name)
          
          # Load the charset if we don't have it
          if !charset
            ResourceManager::load_charsets([charset_name])
            charset                         = ResourceManager::charset(charset_name)  
          end
          if charset
            if charset.errors.any?
              charset.errors.each{ |e|
                @mode.errors << Glaeml::Error.new(charset_element.line, "#{charset_name}:#{e.line}:#{e.text}")
              }
              return @mode
            end
            
            @mode.supported_charsets[charset_name]    = charset
            @mode.default_charset                     = charset if  charset_element.args[1] &&  charset_element.args[1] == "true"
          else
            @mode.warnings << Glaeml::Error.new(charset_element.line,"Failed to load charset '#{charset_name}'.")
          end
        }
        
        if !@mode.default_charset
          @mode.warnings << Glaeml::Error.new(0,"No default charset defined!!")
        end
         
        # Read the preprocessor
        doc.root_node.gpath("preprocessor").each{ |preprocessor_element|
          self.parse_pre_post_processor(preprocessor_element, true)
        }
        
        # Read the postprocessor
        doc.root_node.gpath("postprocessor").each{ |postprocessor_element|
          self.parse_pre_post_processor(postprocessor_element, false)
        }

        # Read the processor
        doc.root_node.gpath("outspace").each{ |outspace_element|
          val                             = outspace_element.args[0]
          @mode.post_processor.out_space  = val.split.reject{|token| token.empty? }       
        }      
        
        doc.root_node.gpath("processor.rules").each{ |rules_element|
        
          rule_group_name                               = rules_element.args.first
          rule_group                                    = RuleGroup.new(@mode,rule_group_name)
          @mode.processor.rule_groups[rule_group_name]  = rule_group
          
          text_procedure = Proc.new { |current_parent_code_block, element|            
            # A block of code lines. Put them in a codelinesterm.   
            term = current_parent_code_block.terms.last
            if(!term || !term.is_code_lines?)
              term = IfTree::CodeLinesTerm.new(current_parent_code_block) 
              current_parent_code_block.terms << term
            end
                                   
            lcount  = element.line
            element.args[0].lines.to_a.each{ |l| 
              # Split into lines of code and count the lines
              l       = l.strip
              term.code_lines << IfTree::CodeLine.new(l, lcount)           
              lcount  += 1                         
            }
          }
          
          element_procedure = Proc.new { |current_parent_code_block, element|
            # This is fatal.
            @mode.errors << Glaeml::Error.new(element.line, "Unknown directive #{element.name}.")      
          }

          processor_context = {
              owner:           rule_group,
              root_element:   rules_element,
              rule_group:     rule_group
          }
          traverse_if_tree(processor_context, text_procedure, element_procedure )
        }

        espeak_option = @mode.options['espeak_voice']
        if espeak_option
          # Singleton lazy load the TTS engine
          # If the mode relies on espeak
          TTS::load_engine
          @mode.has_tts = true
          
          # Check if all voices are supported
          espeak_option.values.keys.each { |vname|
            voice = TTS::option_name_to_voice(vname)
            if !(TTS::voice_list.include? voice)
              @mode.errors << Glaeml::Error.new(espeak_option.line, "Option has unhandled voice #{voice}.")   
            end
          }
        end
        
        @mode.finalize(mode_options) if !@mode.errors.any?
    
        @mode
      end
    end
  end
end
